classdef Fourier < handle
    % Contains static methods for discrete Fourier analysis.
   
    %%%%%%%%%%%%%%%%
    % Math methods %
    %%%%%%%%%%%%%%%%
    
    methods (Static) 
        
        function fHat = fft(f)
            % Calculates the 1d/2d fast Fourier transform of a vector/
            % matrix.
            %
            % Params:
            % - matrix f        any complex input matrix
            %
            % Returns:
            % - matrix fHat     the complex output matrix 
            
            % Determine dimension of input vector
            [n1, n2] = size(f);

            if n1 > 1 && n2 > 1
                fHat = Fourier.fft2(f);
            elseif n1 == 1 || n2 == 1
                fHat = Fourier.fft1(f);
            else
                error('Input y has invalid dimensions.');
            end
            
        end
        
        function f = ifft(fHat)
            % Calculates the 1d/2d inverse fast Fourier transform of a 
            % vector/matrix.
            %
            % Params:
            % - matrix fHat     any complex input matrix
            %
            % Returns:
            % - matrix f        the complex output matrix 
            
            % Determine dimension of input vector
            [n1, n2] = size(fHat);

            if n1 > 1 && n2 > 1
                f = Fourier.ifft2(fHat);
            elseif n1 == 1 || n2 == 1
                f = Fourier.ifft1(fHat);
            else
                error('Input y has invalid dimensions.');
            end
        end
 
        function xy = conv(x, y)
            % Calculates the (circular) convolution using the fast Fourier 
            % transform.
            %
            % Params:
            % - matrix x    any complex input matrix
            % - matrix y    any complex input matrix
            %
            % Returns:
            % - matrix xy   the discrete convolution x*y
            
            % Determine dimension of input data
            [n1, n2] = size(x);
            
            % Show error if necessary
            if (isequal(size(x), size(y)) == 0)
                error("Input vectors/matrices must have same dimensions.");
            end
           
            % Calculate convolution depending on dimension
            if (n1 > 1 && n2 > 1)
                xy = Fourier.ifft2(Fourier.fft2(x) .* Fourier.fft2(y));
            elseif (n1 > 1 && n2 == 1) || (n1 == 1 && n2 > 1)
                xy = Fourier.ifft(Fourier.fft1(x) .* Fourier.fft1(y));
            else
                error("Input data is invalid, matrices are of size 0.");
            end
            
        end
              
    end
    
    methods (Static, Access = private)   
        
        function fHat = fft1(f)
            % Calculates the 1d fast Fourier transform of a vector.
            %
            % Params:
            % - vector f        any complex input vector
            %
            % Returns:
            % - vector fHat     the complex output vector 
    
            % Determine dimension of input vector
            [n1, n2] = size(f);
            m = min(n1, n2);
            n = max(n1, n2);
            
            % Show error if necessary
            if m ~= 1
                error("Input must not be a matrix.");
            end
            if n < 2 || rem(log2(n), 1) > 0
               error("Input vector must be of size 2^m for any positive integer m.");
            end

            % If n is 2, apply the Fourier matrix
            if n == 2
                fHat = zeros(n1, n2);
                fHat(1) = f(1)+f(2);
                fHat(2) = f(1)-f(2);
                return;
            end

            % Halve the value of n
            n = n/2;

            % Calculate c, d
            c = Fourier.fft(f(1:2:2*n));
            d = Fourier.fft(f(2:2:2*n));

            % Correct d value
            for k=1:1:n
               d(k) = exp(-1i*pi*(k-1)/n)*d(k); 
            end

            % Set the values and return
            fHat = zeros(size(f));
            fHat(1:n) = c+d;
            fHat(n+1:2*n) = c-d;
            
        end
        
        function f = ifft1(fHat)
            % Calculates the 1d inverse fast Fourier transform of a vector.
            %
            % Params:
            % - vector fHat     any complex input vector
            %
            % Returns:
            % - vector f        the complex output vector 
    
            % Calculate the IFFT through the FFT by this equivalence:
            % f = 1/n conj(W)*fHat <=> f = 1/n conj(W*conj(fHat))
            
            n = length(fHat);
            fHat = conj(fHat);
            f = 1/n * conj(Fourier.fft(fHat));
            
        end
        
        function fHat = fft2(f)
            % Calculates the 2d fast Fourier transform of a matrix.
            %
            % Params:
            % - matrix f        any complex input matrix
            %
            % Returns:
            % - matrix fHat     the complex output matrix 

            % Determine dimension of input matrix
            [n1, n2] = size(f);
            n = n1;

            % Show error if necessary
            if abs(n2-n1) > 0
                error("Input matrix must be square.");
            end            
            if n < 2 || rem(log2(n), 1) > 0
                error("Input matrix must be of size 2^m for any positive integer m.");
            end
            
            % Initialize zero matrices
            fHatTemp = zeros(n, n);
            fHat = zeros(n, n);

            % Apply the 1d fast Fourier transform for all rows
            for k=1:1:n
               fHatTemp(k,:) = Fourier.fft1(f(k, :).').'; 
            end

            % Apply the 1d fast Fourier transform for all cols
            for k=1:1:n
               fHat(:,k) = Fourier.fft1(fHatTemp(:, k)); 
            end
   
        end
                
        function f = ifft2(fHat)
            % Calculates the 2d inverse fast Fourier transform of a matrix.
            %
            % Params:
            % - matrix fHat     any complex input matrix
            %
            % Returns:
            % - matrix f        the complex output matrix 
    
            % Calculate the IFFT through the FFT by this equivalence:
            % f = 1/n^2 conj(W)*fHat <=> y = 1/n^2 conj(W*conj(fHat))
            
            n = length(fHat);
            fHat = conj(fHat);
            f = 1/n^2 * conj(Fourier.fft2(fHat));
            
        end
        
    end
    
    %%%%%%%%%%%%%%%%
    % Test methods %
    %%%%%%%%%%%%%%%%
    
    methods (Static)
                
        function test()
            % Tests the functionality of the class and prints the result.
            
            % Setup test variables
            tol = 10^(-9);
            amount = 5;
                         
            fprintf('========================================\n\n');
            fprintf('Starting Fourier class test...\n\n');
            fprintf('- Error tolerance: %d\n', tol);
            fprintf('- Tests per method: %d\n', amount);
            fprintf('\n');
            
            % Test FFT  
            fprintf('----------\nTesting FFT:\n');
            for k=1:amount
                Fourier.fftTest(tol)
            end
            
            % Test IFFT  
            fprintf('----------\nTesting IFFT:\n');
            for k=1:amount
                Fourier.ifftTest(tol)
            end
            
            % Test FFT/IFFT  
            fprintf('----------\nTesting FFT&IFFT:\n');
            for k=1:amount
                Fourier.fftifftTest(tol)
            end
            
            % Test FFT2  
            fprintf('----------\nTesting FFT2:\n');
            for k=1:amount
                Fourier.fft2Test(tol)
            end
            
            % Test IFFT 2 
            fprintf('----------\nTesting IFFT2:\n');
            for k=1:amount
                Fourier.ifft2Test(tol)
            end
            
            % Test FFT2/IFFT2  
            fprintf('----------\nTesting FFT2&IFFT2:\n');
            for k=1:amount
                Fourier.fft2ifft2Test(tol)
            end
    
            % Test circular convolution     
            fprintf('----------\nTesting Convolution:\n');
            for k=1:amount
                Fourier.convTest(tol)
            end
            
            fprintf('----------\nTesting completed with 0 issues.\n');
            
        end

    end
    
    methods (Static, Access = private)    
                
        function fftTest(tol)
            y = Fourier.randc(2^16, 1);
            diff = max(abs(Fourier.fft(y) - fft(y)));
            Fourier.printTestResult(diff, tol);
        end
        
        function ifftTest(tol)
            y = Fourier.randc(2^16, 1);
            diff = max(abs(Fourier.ifft(y) - ifft(y)));
            Fourier.printTestResult(diff, tol);
        end
        
        function fftifftTest(tol)
            y = Fourier.randc(2^16, 1);
            diff = max(abs(Fourier.fft(Fourier.ifft(y)) - y));
            Fourier.printTestResult(diff, tol); 
        end
        
        function fft2Test(tol)
            y = Fourier.randc(2^8, 2^8);
            diff = max(max(abs(Fourier.fft(y) - fft2(y))));
            Fourier.printTestResult(diff, tol);
        end
        
        function ifft2Test(tol)
            y = Fourier.randc(2^8, 2^8);
            diff = max(max(abs(Fourier.ifft(y) - ifft2(y))));
            Fourier.printTestResult(diff, tol);
        end
        
        function fft2ifft2Test(tol)
            y = Fourier.randc(2^8, 2^8);
            diff = max(max(abs(Fourier.fft(Fourier.ifft(y)) - y)));
            Fourier.printTestResult(diff, tol); 
        end
        
        function convTest(tol)
            x = Fourier.randc(2^10, 1);
            y = Fourier.randc(2^10, 1);
            diff = max(abs(Fourier.conv(x, y) - cconv(x, y, 2^10)));
            Fourier.printTestResult(diff, tol);
        end
        
        function y = randc(m, n)
            y = randi(100, m, n) .* rand(m, n) + 1i * randi(100, m, n) .* rand(m, n);
        end
        
        function printTestResult(diff, tol)
            if (diff > tol)
                fprintf('[ ] Calculation error: %d\n', diff);
                error('Error too high or tolerance too low.');
            else
                fprintf('[X] Calculation error: %d\n', diff);
            end
        end
        
    end
    
end